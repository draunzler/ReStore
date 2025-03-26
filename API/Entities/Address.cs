using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class Address
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Country { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
    }
}