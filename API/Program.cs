using API.Data;
using API.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection"); // connectionString of postgres database
builder.Services.AddDbContext<StoreContext>(opt =>
    opt.UseNpgsql(connectionString) // connection with postgres
);

var app = builder.Build();
using var scope = app.Services.CreateScope(); // get rid of of it after
var context = scope.ServiceProvider.GetRequiredService<StoreContext>(); // get the DB connection
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>(); // log any error to the console, since no access to eror exception page
try
{
    context.Database.Migrate();
    DbInitializer.Initializer(context);
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

// app.UseHttpsRedirection(); // No redirection to https, since in devoloper mode
app.UseRouting();

app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
});

app.UseAuthorization();

app.MapControllers();

app.Run();
