using AppDock.Services.AuthAPI.Models;

namespace AppDock.Services.AuthAPI.Services.IServices
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(AppDockUser appDockUser, IEnumerable<string> roles);
    }
}
