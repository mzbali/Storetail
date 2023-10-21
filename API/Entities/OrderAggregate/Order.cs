using System.ComponentModel.DataAnnotations;

namespace API.Entities.OrderAggregate
{
    public class Order
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }

        [Required] public ShippingAddress ShippingAddress { get; set; } = default!;

        public List<OrderItem> OrderItems { get; set; } = default!;
        public DateTime OrderDate { get; set; } = DateTime.Now.ToUniversalTime();
        public long SubTotal { get; set; }
        public long DeliveryFee { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public long GetTotal()
        {
            return SubTotal + DeliveryFee;
        }
    }
}