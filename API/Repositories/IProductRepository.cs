using API.Entities;
using API.RequestHelpers;

namespace API.Repositories
{
    public interface IProductRepository
    {
        Task<PagedList<Product>> GetProductsAsync(ProductParams productParams);
        Task<Product> GetProductByIdAsync(int id);
        Task<Product> CreateProductAsync(Product product);
        Task<Product> UpdateProductAsync(Product product);
        Task<bool> DeleteProductAsync(int id);
        Task<List<string>> GetProductBrandsAsync();
        Task<List<string>> GetProductTypesAsync();
    }
}