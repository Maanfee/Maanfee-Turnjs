using Microsoft.Extensions.DependencyInjection;

namespace Maanfee.Turnjs
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddTurnjs(this IServiceCollection services)
        {
            services.AddScoped<TurnjsService>();

            return services;
        }
    }  
}
