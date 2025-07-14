using AppDock.Services.PortfolioAPI.Models.DTO;

namespace AppDock.Services.PortfolioAPI.Services.IServices
{
    public interface IContactService
    {
        Task<string> AddOrUpdateContactAsync(ContactDto contactDto);
        Task<ContactDto> GetContactAsync(string userId);
    }
}
