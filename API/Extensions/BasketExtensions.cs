using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class BasketExtensions
    {
        public static BasketDto MapToBasketDto(this Basket basket)
        {

            return new BasketDto
            {
                BasketId = basket.Id,
                BuyerId = basket.BuyerId,
                PaymentIntentId = basket.PaymentIntentId,
                ClientSecret = basket.ClientSecret,
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
        public static IQueryable<Basket> RetrieveBasketWithItems(this IQueryable<Basket> basket, string? buyerId)
        {

            return basket
                .Include(i => i.Items) // include items list
                .ThenInclude(p => p.Product) // in that items all the Product details
                .Where(x => x.BuyerId == buyerId);
        }
    }
}