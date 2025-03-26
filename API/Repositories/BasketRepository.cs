using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class BasketRepository : IBasketRepository
    {
        private readonly StoreContext _context;

        public BasketRepository(StoreContext context)
        {
            _context = context;
        }

        public async Task<Basket> GetBasketAsync(string buyerId)
        {
            return await _context.Baskets
                .Include(b => b.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(b => b.BuyerId == buyerId);
        }

        public async Task<Basket> CreateBasketAsync(string buyerId)
        {
            var basket = new Basket { BuyerId = buyerId };
            _context.Baskets.Add(basket);
            await _context.SaveChangesAsync();
            return basket;
        }

        public async Task<Basket> UpdateBasketAsync(Basket basket)
        {
            _context.Entry(basket).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return basket;
        }

        public async Task DeleteBasketAsync(int id)
        {
            var basket = await _context.Baskets.FindAsync(id);
            if (basket != null)
            {
                _context.Baskets.Remove(basket);
                await _context.SaveChangesAsync();
            }
        }
    }
}