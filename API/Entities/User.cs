using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser
    {
        public string DisplayName { get; set; }
        public Address Address { get; set; }
    }
}