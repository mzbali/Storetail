using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseController
    {
        private readonly StoreContext _context;
        private readonly ILogger<BasketController> _logger;
        public BasketController(StoreContext context, ILogger<BasketController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            // Log the value of the buyerId cookie
            var buyerId = GetBuyerId();
            _logger.LogInformation("BuyerId from cookie: {buyerId}", buyerId);

            var basket = await _context.Baskets.RetrieveBasketWithItems(buyerId).FirstOrDefaultAsync();

            // Log the retrieved basket
            _logger.LogInformation("Retrieved basket: {Basket}", basket);

            if (basket == null) return NotFound();

            //return basket; // cycle object BAD!!

            // map Product to basketItem with the help of navigational properties and DTOs
            return basket.MapToBasketDto();

        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            // get Basket || create Basket
            var basket = await _context.Baskets.RetrieveBasketWithItems(GetBuyerId()).FirstOrDefaultAsync() ?? CreateBasket(); // don't forget to await
            // get Product
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
                return BadRequest(new ProblemDetails
                {
                    Detail = "Product Not Found"
                });
            // add to Basket
            basket.AddItem(product, quantity);
            // save changes
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return CreatedAtRoute("GetBasket", basket.MapToBasketDto()); // Successful creation of resource in database

            return BadRequest(new ProblemDetails
            {
                Title = "Problem saving Basket"
            });
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteBasket(int productId, int quantity)
        {
            var basket = await _context.Baskets.RetrieveBasketWithItems(GetBuyerId()).FirstOrDefaultAsync();
            if (basket == null)
                return NotFound(new ProblemDetails
                {
                    Title = "Product is not in the Basket"
                });
            basket.RemoveItem(productId, quantity);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();

            return BadRequest(new ProblemDetails
            {
                Title = "Problem deleting item from the Basket"
            });
        }

        private Basket CreateBasket()
        {
            var buyerId = User.Identity?.Name;
            if (string.IsNullOrEmpty(buyerId))
            {
                buyerId = Guid.NewGuid().ToString(); // make a new guid (new unique Id)

                _logger.LogInformation("GUID WHEN CREATING: {BuyerId}", buyerId);

                // Cookie setup
                var cookieOptions = new CookieOptions
                {
                    IsEssential = true,
                    Expires = DateTime.Now.AddDays(30),
                    Secure = false
                };
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
                // Basket creation
            }
            var basket = new Basket
            {
                BuyerId = buyerId
            };

            _context.Baskets.Add(basket);

            return basket;
        }


        private string GetBuyerId()
        {
            return User.Identity.Name ?? Request.Cookies["buyerId"];
        }
    }
}