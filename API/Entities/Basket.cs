namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; } = default!;
        public List<BasketItem> Items { get; set; } = new();

        // we'll send the productId then find the Product in controller, then add the item to Basket
        // so no need to find it in AddItem
        public void AddItem(Product product, int quantity)
        {
            if (Items.All(item => item.Id != product.Id))
            {
                Items.Add(new BasketItem { Quantity = quantity, Product = product });
            }
            var existingItem = Items.FirstOrDefault(item => item.Id == product.Id);

            if (existingItem != null) existingItem.Quantity += quantity;
        }

        public void removeItem(int productId, int quantity)
        {
            var item = Items.FirstOrDefault(item => item.ProductId == productId);
            if (item == null) return;
            item.Quantity -= quantity;
            if (item.Quantity == 0) Items.Remove(item);
        }

    }
}