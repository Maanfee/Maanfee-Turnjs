using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using MudBlazor.Services;
using Maanfee.Turnjs;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

builder.Services.AddTurnjs();
builder.Services.AddMudServices();

await builder.Build().RunAsync();
