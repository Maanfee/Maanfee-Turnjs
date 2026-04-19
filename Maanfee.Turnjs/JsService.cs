using Microsoft.JSInterop;

namespace Maanfee.JsServices
{
    public abstract class JsService : IAsyncDisposable
    {
        public JsService(IJSRuntime JsRuntime, string NameSpace, string JsFileName = "JsInterop.js")
        {
            _JSRuntime = JsRuntime ?? throw new ArgumentNullException(nameof(JsRuntime));
            _NameSpace = NameSpace ?? throw new ArgumentNullException(nameof(NameSpace));
            _JsFileName = JsFileName ?? throw new ArgumentNullException(nameof(JsFileName));
        }

        protected readonly IJSRuntime _JSRuntime;
        protected IJSObjectReference _Module;
        protected bool IsDisposed = false;
        private readonly string _NameSpace = string.Empty;
        private readonly string _JsFileName = string.Empty;

        protected virtual async Task EnsureModuleLoaded()
        {
            if (_Module == null)
            {
                _Module = await _JSRuntime.InvokeAsync<IJSObjectReference>("import", $"./_content/{_NameSpace}/js/JsInterop.js");

                // اطمینان از بارگذاری وابستگی‌ها
                await _Module.InvokeVoidAsync("ensureDependencies");
            }
        }

        // ********************************************

        public async ValueTask DisposeAsync()
        {
            if (!IsDisposed)
            {
                if (_Module != null)
                {
                    await _Module.DisposeAsync();
                    _Module = null;
                }

                IsDisposed = true;
            }
        }

    }
}
