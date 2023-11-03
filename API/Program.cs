using System.Text;
using API.Data;
using API.Entities;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.ApiKey,
        Description = "Put Bearer + your token in the box below",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            jwtSecurityScheme, new List<string>()
        }
    });
});
builder.Services.AddCors();
builder.Services.AddIdentityCore<User>(opt => { opt.User.RequireUniqueEmail = true; })
    .AddRoles<Role>()
    .AddEntityFrameworkStores<StoreContext>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey =
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:SecurityKey"]))
        };
    }
);
builder.Services.AddAuthorization();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<PaymentService>();

var connectionString = "";
if (builder.Environment.IsDevelopment())
{
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection"); // connectionString of postgres database
}
else
{
    var pgHost = Environment.GetEnvironmentVariable("POSTGRES_HOST");
    var pgPort = Environment.GetEnvironmentVariable("POSTGRES_PORT");
    var pgUser = Environment.GetEnvironmentVariable("POSTGRES_USER");
    var pgPass = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
    var pgDb = Environment.GetEnvironmentVariable("POSTGRES_DB");

    if (pgHost != null && pgPort != null && pgUser != null && pgPass != null && pgDb != null)
    {
        connectionString = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};";
    }
    else
    {
        // Handle the case where environment variables are not set or incomplete.
        // You can log an error or throw an exception if necessary.
        throw new ApplicationException("PostgresSQL environment variables are not properly set.");
    }
}
builder.Services.AddDbContext<StoreContext>(opt =>
        opt.UseNpgsql(connectionString) // connection with postgres
);

var app = builder.Build();
using var scope = app.Services.CreateScope(); // get rid of of it after
var context = scope.ServiceProvider.GetRequiredService<StoreContext>(); // get the DB connection
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
var logger =
    scope.ServiceProvider
        .GetRequiredService<
            ILogger<Program>>(); // log any error to the console, since no access to error exception page
try
{
    context.Database.Migrate();
    await DbInitializer.Initializer(context, userManager);
}
catch (Exception ex)
{
    logger.LogError(ex, "Problem Migrating Data");
}

// Invoke our custom middleware to handle any exception
app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // No redirection to https, since in developer mode
app.UseRouting();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
});

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();
app.MapFallbackToController("Index", "Fallback");

app.Run();