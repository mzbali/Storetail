using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("BasketItems")] // name the table BasketItems not BasketItem
    public class BasketItem
    {
        public int Id { get; set; }
        public int Quantity { get; set; }

        // navigational properties
        public int ProductId { get; set; }
        public Product Product { get; set; } = default!;

        public int BasketId { get; set; }
        public Basket Basket { get; set; } = default!;

    }
}