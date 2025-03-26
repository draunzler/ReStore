using API.Entities;

namespace API.Repositories
{
    public interface IBasketRepository
    {
        Task<Basket> GetBasketAsync(string buyerId);
        Task<Basket> CreateBasketAsync(string buyerId);
        Task<Basket> UpdateBasketAsync(Basket basket);
        Task DeleteBasketAsync(int id);
    }
}