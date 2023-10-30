using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController : BaseController
    {
        private readonly IConfiguration _config;
        private readonly StoreContext _context;
        private readonly PaymentService _payment;
        public PaymentsController(PaymentService payment, StoreContext context, IConfiguration config)
        {
            _payment = payment;
            _context = context;
            _config = config;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
        {
            var basket = await _context.Baskets.RetrieveBasketWithItems(User.Identity?.Name).FirstOrDefaultAsync();
            if (basket == null)
                return BadRequest(new ProblemDetails
                {
                    Title = "Basket does not exist for creating PI."
                });
            var intent = await _payment.CreateOrUpdatePaymentIntent(basket);
            basket.PaymentIntentId = intent.Id;
            basket.ClientSecret = intent.ClientSecret;

            var result = await _context.SaveChangesAsync() > 0;

            if (!result)
                return BadRequest(new ProblemDetails
                {
                    Title = "Problem updating basket for PI."
                });
            return basket.MapToBasketDto();
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            var stripeEvent = EventUtility
                .ConstructEvent(json, Request.Headers["Stripe-Signature"], _config["StripeSettings:WhSecret"]);
            var charge = (Charge)stripeEvent.Data.Object;

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.PaymentIntentId == charge.PaymentIntentId);

            if (charge.Status == "succeeded" && order != null) order.Status = OrderStatus.PaymentReceived;

            var result = await _context.SaveChangesAsync() > 0;

            if (!result)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Something Happened with the stripe webhook",
                    Status = 500
                });
            }
            return new EmptyResult();
        }
    }
}