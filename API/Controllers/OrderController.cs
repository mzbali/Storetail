using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrderController : BaseController
    {
        private readonly StoreContext _context;
        public OrderController(StoreContext context)
        {
            _context = context;

        }
        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            return await _context.Orders
                .ProjectOrderToOrderDto()
                .Where(o => o.BuyerId == User.Identity.Name)
                .ToListAsync();
        }

        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            return await _context.Orders
                .ProjectOrderToOrderDto()
                .Where(o => o.BuyerId == User.Identity.Name && o.Id == id)
                .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateOrder(CreateOrderDto createOrderDto)
        {
            var basket = await _context.Baskets.RetrieveBasketWithItems(User.Identity.Name).FirstOrDefaultAsync();
            if (basket is null)
                return BadRequest(new ProblemDetails
                {
                    Title = "Could not find basket."
                });
            var items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var productItem = await _context.Products.FindAsync(item.ProductId);

                if (productItem is null)
                    return BadRequest(new ProblemDetails
                    {
                        Title = "Product not found."
                    });

                var itemOrder = new ProductItemOrdered
                {
                    ProductId = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl
                };

                var orderItem = new OrderItem
                {
                    Product = itemOrder,
                    Price = productItem.Price,
                    Quantity = item.Quantity
                };

                items.Add(orderItem);
                productItem.QuantityInStock -= item.Quantity;
            }
            var total = items.Sum(i => i.Price * i.Quantity);
            var deliveryFee = total < 10000 ? 500 : 0;
            var order = new Order
            {
                BuyerId = User.Identity.Name,
                ShippingAddress = createOrderDto.ShippingAddress,
                OrderItems = items,
                OrderDate = default,
                SubTotal = total,
                DeliveryFee = deliveryFee,
                Status = OrderStatus.Pending
            };
            _context.Orders.Add(order);
            _context.Baskets.Remove(basket);

            if (createOrderDto.SaveAddress)
            {
                var user = await _context.Users
                    .Include(a => a.Address).FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);

                if (user is null)
                    return BadRequest(new ProblemDetails
                    {
                        Title = "User could not be found to save the address."
                    });

                var address = new UserAddress
                {
                    FullName = createOrderDto.ShippingAddress.FullName,
                    Address1 = createOrderDto.ShippingAddress.Address1,
                    Address2 = createOrderDto.ShippingAddress.Address2,
                    City = createOrderDto.ShippingAddress.City,
                    State = createOrderDto.ShippingAddress.State,
                    Zip = createOrderDto.ShippingAddress.Zip,
                    Country = createOrderDto.ShippingAddress.Country
                };
                user.Address = address;
                _context.Users.Update(user);
            }
            var result = await _context.SaveChangesAsync() > 0;
            if (result)
                return CreatedAtRoute("GetOrder",
                    new
                    {
                        id = order.Id
                    },
                    order.Id);
            return BadRequest(new ProblemDetails
            {
                Title = "Problem creating orders"
            });
        }
    }
}