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
                    IsEmailVerified = false,
                    EmailVerificationToken = string.Empty,
                };
            }

            return new AppDockUserDto
            {
                userId = user.Id,
                Email = user.Email,
                Name = user.Name,
                PhoneNumber = user.PhoneNumber,
                IsEmailVerified = user.IsEmailVerified,
                EmailVerificationToken = user.EmailVerificationToken,
            };
        }

        public async Task<AppDockUserDto> GetUserByVerificationToken(string token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailVerificationToken == token);

            if (user == null)
            {
                return new AppDockUserDto
                {
                    userId = string.Empty,
                    Email = string.Empty,
                    Name = string.Empty,
                    PhoneNumber = string.Empty,
                    IsEmailVerified = false,
                    EmailVerificationToken = string.Empty,
                };
            }

            return new AppDockUserDto
            {
                userId = user.Id,
                Email = user.Email,
                Name = user.Name,
                PhoneNumber = user.PhoneNumber,
                IsEmailVerified = user.IsEmailVerified,
                EmailVerificationToken = user.EmailVerificationToken,
            };
        }

        public async Task<AppDockUserDto> UpdateUserAsync(AppDockUserDto appdockUserDto)
        {
            if (appdockUserDto == null)
                throw new ArgumentNullException(nameof(appdockUserDto), "User cannot be null.");

            if (string.IsNullOrWhiteSpace(appdockUserDto.Email))
                throw new ArgumentException("Email is required.", nameof(appdockUserDto.Email));

            // Try to find existing user by ID or Email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == appdockUserDto.userId || u.Email == appdockUserDto.Email);

            if (user == null)
            {
                // Return empty DTO if user not found
                return new AppDockUserDto
                {
                    userId = string.Empty,
                    Email = string.Empty,
                    Name = string.Empty,
                    PhoneNumber = string.Empty,
                    IsEmailVerified = false,
                    EmailVerificationToken = string.Empty,
                };
            }

            // Update fields
            user.Name = appdockUserDto.Name;
            user.PhoneNumber = appdockUserDto.PhoneNumber;
            user.IsEmailVerified = appdockUserDto.IsEmailVerified;
            user.EmailVerificationToken = appdockUserDto.EmailVerificationToken;

            // Save changes to DB
            await _context.SaveChangesAsync();

            // Return updated DTO
            return new AppDockUserDto
            {
                userId = user.Id,
                Email = user.Email,
                Name = user.Name,
                PhoneNumber = user.PhoneNumber,
                IsEmailVerified = user.IsEmailVerified,
                EmailVerificationToken = user.EmailVerificationToken,
            };
        }

    }
}
