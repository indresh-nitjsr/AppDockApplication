using AppDock.Services.AuthAPI.data;
using AppDock.Services.AuthAPI.Models;
using AppDock.Services.AuthAPI.Models.Dto;
using AppDock.Services.AuthAPI.Services.IServices;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using System.Net;

namespace AppDock.Services.AuthAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly AuthApplicationDbContext _context;
        private readonly UserManager<AppDockUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IEMailService _emailService;
        private readonly IConfiguration _configuration;

        public AuthService(
            AuthApplicationDbContext context, 
            UserManager<AppDockUser> userManager, 
            RoleManager<IdentityRole> roleManager, 
            IJwtTokenGenerator jwtTokenGenerator, 
            IEMailService emailService,
            IConfiguration config
            )
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _jwtTokenGenerator = jwtTokenGenerator;
            _emailService = emailService;
            _configuration = config;
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
                return new LoginResponseDto { User = null, Token = "", Message = "Invalid Credencials" };
            }

            // Validate password
            var isValid = await _userManager.CheckPasswordAsync(user, loginRequestDto.Password);
            if (!isValid)
            {
                return new LoginResponseDto { User = null, Token = "", Message = "Email or Password Incorrect" };
            }

            // Prepare user DTO
            var userDto = new AppDockUserDto
            {
                Email = user.Email,
                userId = user.Id,
                Name = user.Name,
                PhoneNumber = user.PhoneNumber,
                IsEmailVerified = user.IsEmailVerified
            };

            // Generate JWT token here
            var roles = await _userManager.GetRolesAsync(user);
            var token = _jwtTokenGenerator.GenerateToken(user, roles); // Assuming you have a service for this

            var loginResponseDto = new LoginResponseDto
            {
                User = userDto,
                Token = token,
                Message = "User Logged in Successful"
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
                PhoneNumber = registrationRequestDto.PhoneNumber,
                IsEmailVerified = false,
                EmailVerificationToken = Guid.NewGuid().ToString() // ✅ Set heres
            };

            if (user == null)
            {
                throw new Exception("User object is null during registration.");
            }

            if (string.IsNullOrWhiteSpace(user.Email))
            {
                throw new Exception("User email is null or empty during registration.");
            }

            var result = await _userManager.CreateAsync(user, registrationRequestDto.Password);
            if (!result.Succeeded)
            {
                return result.Errors.FirstOrDefault()?.Description ?? "Registration failed.";
            }

            // Assign role
            //if (!await _roleManager.RoleExistsAsync(registrationRequestDto.Role))
            //    await _roleManager.CreateAsync(new IdentityRole(registrationRequestDto.Role));

            //await _userManager.AddToRoleAsync(user, registrationRequestDto.Role);

            // Generate and send email confirmation link
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = WebUtility.UrlEncode(token);
            var frontendUrl = _configuration["ApplicationUrls:emailVerificationUrl"];
            if (string.IsNullOrWhiteSpace(frontendUrl))
            {
                throw new Exception("Frontend email verification URL is not configured.");
            }

            var verifyUrl = $"{frontendUrl}?userId={user.Id}&token={encodedToken}";

            try
            {
                await _emailService.SendVerificationEmail(user.Email, verifyUrl);
            }
            catch (Exception ex)
            {
                await _userManager.DeleteAsync(user);
                // Log or rethrow with more context
                throw new Exception("Failed to send verification email", ex);
            }


            return "Registration successful. Please check your email to verify your account.";
        }

    }
}
