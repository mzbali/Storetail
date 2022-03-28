using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context); // just delegate it to next middleware
            }
            catch (Exception ex) // but ever a error escaped from any middleware catch it here
            {
                _logger.LogError(ex, ex.Message); // log the error on my console
                context.Response.StatusCode = 500; // header http status code
                context.Response.ContentType = "application/json"; // gonna send a json

                var response = new ProblemDetails
                {
                    Title = ex.Message,
                    Status = 500, // again status code for body of response, before was for header
                    Detail = _env.IsDevelopment() ? ex.StackTrace?.ToString() : null
                };

                var option = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }; // specifying how to format the key
                var json = JsonSerializer.Serialize(response, option); // Problem details into json string with the option
                await context.Response.WriteAsync(json); // send the response
            }
        }
    }
}