using API.DTOs;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class OrderExtensions
    {
        public static IQueryable<OrderDto> ProjectOrderToOrderDto(this IQueryable<Order> order)
        {
            return order.Select(o => new OrderDto
            {
                Id = o.Id,
                BuyerId = o.BuyerId,
                Address = o.ShippingAddress,
                OrderItems = o.OrderItems.Select(item => new OrderItemDto
                {
                    ProductId = item.Product.ProductId,
                    Name = item.Product.Name,
                    PictureUrl = item.Product.PictureUrl,
                    Quantity = item.Quantity,
                    Price = item.Price
                }).ToList(),
                OrderDate = o.OrderDate,
                SubTotal = o.SubTotal,
                OrderStatus = o.Status.ToString(),
                DeliveryFee = o.DeliveryFee,
                Total = o.GetTotal(),
                PaymentIntentId = o.PaymentIntentId
            }).AsNoTracking();
        }
    }
}