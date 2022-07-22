using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseController
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            Basket? basket = await RetrieveBasket();

            if (basket == null) return NotFound();

            //return basket; // cycle object BADDD!!

            // map Product to basketItem with the help of navigational properties and DTOs
            return MapBasketToDto(basket);

        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            // get Basket || create Basket
            var basket = await RetrieveBasket(); // don't forget to await
            if (basket == null) basket = CreateBasket();
            // get Product
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return BadRequest(new ProblemDetails { Detail = "Product Not Found" });
            // add to Basket
            basket.AddItem(product, quantity);
            // save changes
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return CreatedAtRoute("GetBasket", MapBasketToDto(basket)); // succesfull creation of resource in database

            return BadRequest(new ProblemDetails { Title = "Problem saving Basket" });
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteBasket(int productId, int quantity)
        {
            var basket = await RetrieveBasket();
            if (basket == null) return NotFound(new ProblemDetails { Title = "Product is not in the Basket" });
            basket.removeItem(productId, quantity);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting item from the Basket" });
        }

        private Basket CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString(); // make a new guid (new unique Id)
            // Cookie setup
            var cookieOption = new CookieOptions { Expires = DateTime.Now.AddDays(3), IsEssential = true };
            Response.Cookies.Append("buyerId", buyerId, cookieOption);
            // Basket creation
            var basket = new Basket { BuyerId = buyerId };

            _context.Baskets.Add(basket);

            return basket;
        }

        private async Task<Basket?> RetrieveBasket()
        {
            return await _context.Baskets
                .Include(i => i.Items) // include items list
                .ThenInclude(p => p.Product) // in that items all the Product details
                .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }

        private BasketDto MapBasketToDto(Basket basket)
        {
            return new BasketDto
            {
                BasketId = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.Product.Id,
                    Name = item.Product.Name,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Price = item.Product.Price,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity,
                }).ToList()
            };
        }

    }
}