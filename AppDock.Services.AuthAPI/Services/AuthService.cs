using AppDock.Services.AuthAPI.data;
using AppDock.Services.AuthAPI.Models;
using AppDock.Services.AuthAPI.Models.Dto;
using AppDock.Services.AuthAPI.Services.IServices;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;

namespace AppDock.Services.AuthAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly AuthApplicationDbContext _context;
        private readonly UserManager<AppDockUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public AuthService(AuthApplicationDbContext context, 
            UserManager<AppDockUser> userManager, 
            RoleManager<IdentityRole> roleManager,
            IJwtTokenGenerator jwtTokenGenerator )
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<bool> AssignRole(string email, string roleName)
        {
            var user = _context.AppDockUsers.FirstOrDefault(u => u.Email.ToLower() == email.ToLower());
            if (user != null)
            {
                if (!_roleManager.RoleExistsAsync(roleName).GetAwaiter().GetResult())
                {
                    //create role if it does not exist
                    _roleManager.CreateAsync(new IdentityRole(roleName)).GetAwaiter().GetResult();
                }
                await _userManager.AddToRoleAsync(user, roleName);
                return true;    
            }
            return false;
        }

        public async Task<LoginResponseDto> Login(LoginRequestDto loginRequestDto)
        {
            // First find user by email (assuming UserName stores email)
            var user = _context.AppDockUsers.FirstOrDefault(u => u.UserName.ToLower() == loginRequestDto.Email.ToLower());

            // Check if user exists first
            if (user == null)
            {
                return new LoginResponseDto { User = null, Token = "" };
            }

            // Validate password
            var isValid = await _userManager.CheckPasswordAsync(user, loginRequestDto.Password);
            if (!isValid)
            {
                return new LoginResponseDto { User = null, Token = "" };
            }

            // Prepare user DTO
            var userDto = new AppDockUserDto
            {
                Email = user.Email,
                userId = user.Id,
                Name = user.Name,
                PhoneNumber = user.PhoneNumber
            };

            // Generate JWT token here
            var roles = await _userManager.GetRolesAsync(user);
            var token = _jwtTokenGenerator.GenerateToken(user, roles); // Assuming you have a service for this

            var loginResponseDto = new LoginResponseDto
            {
                User = userDto,
                Token = token
            };

            return loginResponseDto;
        } 
        
        public async Task<string> Register(RegistrationRequestDto registrationRequestDto)
        {
            var user = new AppDockUser
            {
                UserName = registrationRequestDto.Email,            // Email as username
                Email = registrationRequestDto.Email,
                NormalizedEmail = registrationRequestDto.Email.ToUpper(),
                Name = registrationRequestDto.UserName,
                PhoneNumber = registrationRequestDto.PhoneNumber                       
            };

            try
            {
                var result = await _userManager.CreateAsync(user, registrationRequestDto.Password);

                if (result.Succeeded)
                {
                    return "Registration successful.";
                }
                else
                {
                    // Return first error message
                    var errorDescription = result.Errors.FirstOrDefault()?.Description ?? "Unknown error";
                    return $"Registration failed: {errorDescription}";
                }
            }
            catch (Exception ex)
            {
                return $"An error occurred: {ex.Message}";
            }
        }

    }
}
