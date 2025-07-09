using AppDock.Services.AuthAPI.data;
using AppDock.Services.AuthAPI.Models.Dto;
using AppDock.Services.AuthAPI.Services.IServices;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace AppDock.Services.AuthAPI.Services
{
    public class UserService : IUserService
    {
        private readonly AuthApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UserService(AuthApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<AppDockUserDto> GetUserByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return new AppDockUserDto
                {
                    userId = string.Empty,
                    Email = string.Empty,
                    Name = string.Empty,
                    PhoneNumber = string.Empty,
                    isPortfolio = false
                };
            }

            return new AppDockUserDto
            {
                userId = user.Id,
                Email = user.Email,
                Name = user.Name,
                PhoneNumber = user.PhoneNumber,
                isPortfolio = user.isportfolio
            };
        }
    }
}
