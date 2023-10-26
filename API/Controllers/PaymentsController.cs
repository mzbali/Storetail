using API.Data;
using API.DTOs;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class PaymentsController : BaseController
    {
        private readonly StoreContext _context;
        private readonly PaymentService _payment;
        public PaymentsController(PaymentService payment, StoreContext context)
        {
            _payment = payment;
            _context = context;

        }
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
        {
            var basket = await _context.Baskets.RetrieveBasketWithItems(User.Identity?.Name).FirstOrDefaultAsync();
            if (basket is null)
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
    }
}