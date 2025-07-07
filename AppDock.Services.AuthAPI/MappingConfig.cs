using AppDock.Services.AuthAPI.Models;
using AppDock.Services.AuthAPI.Models.Dto;
using AutoMapper;

namespace AppDock.Services.AuthAPI
{
    public class MappingConfig
    {
        public static MapperConfiguration RegisterMaps()
        {
            var MappingConfig = new MapperConfiguration(config =>
            {
                config.CreateMap<RegistrationRequestDto, AppDockUser>();
                config.CreateMap<AppDockUser, RegistrationRequestDto>();
                config.CreateMap<AppDockUser, AppDockUserDto>();
            });
            return MappingConfig;
        }
    }
}
