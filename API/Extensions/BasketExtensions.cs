using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class BasketExtensions
    {
        public static BasketDto? MapToBasketDto(this Basket basket)
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
                    Quantity = item.Quantity
                }).ToList()
            };
        }
        public static async Task<Basket?> RetrieveBasket(this IQueryable<Basket> basket, string? buyerId, StoreContext context)
        {
            if (string.IsNullOrEmpty(buyerId)) return null;

            return await context.Baskets
                .Include(i => i.Items) // include items list
                .ThenInclude(p => p.Product) // in that items all the Product details
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }
    }
}