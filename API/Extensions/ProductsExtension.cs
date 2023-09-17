using API.Entities;

namespace API.Extensions
{
    public static class ProductsExtension
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string? OrderBy)
        {
            // If orderBy has null or whitespace from the user return just name in alphabatical order
            if (string.IsNullOrWhiteSpace(OrderBy)) return query.OrderBy(p => p.Name);

            query = OrderBy switch
            {
                "price" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderByDescending(p => p.Price),
                _ => query.OrderBy(p => p.Name)
            };

            return query;
        }

        public static IQueryable<Product> Search(this IQueryable<Product> query, string? searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));
        }

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string? brands, string? types)
        {
            var brandsList = new List<string>();
            var typesList = new List<string>();

            if (!string.IsNullOrEmpty(brands))
                brandsList.AddRange(brands.ToLower().Split(",").ToList());
            if (!string.IsNullOrEmpty(types))
                typesList.AddRange(types.ToLower().Split(",").ToList());

            query = query.Where(p => brandsList.Count == 0 || brandsList.Contains(p.Brand.ToLower()));
            query = query.Where(p => typesList.Count == 0 || typesList.Contains(p.Type.ToLower()));

            return query;
        }
    }
}