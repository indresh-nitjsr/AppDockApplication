using AppDock.PortfolioService.Models;
using AppDock.Services.PortfolioAPI.Models;
using AppDock.Services.PortfolioAPI.Models.DTO;
using AutoMapper;

namespace AppDock.Services.PortfolioAPI
{
    public class MappingConfig
    {
        public static MapperConfiguration RegisterMaps()
        {
            var MappingConfig = new MapperConfiguration(config =>
            {
                config.CreateMap<PortfolioDto, UserPortfolio>();
                config.CreateMap<UserPortfolio, PortfolioDto>();

                config.CreateMap<AboutDto, About>();
                config.CreateMap<About, AboutDto>();
            });
            return MappingConfig;
        }
    }
}
