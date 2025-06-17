using Microsoft.JSInterop;

namespace Maanfee.Turnjs
{
    public class TurnjsService : IAsyncDisposable
    {
        private readonly IJSRuntime _jsRuntime;
        private IJSObjectReference _module;
        private DotNetObjectReference<TurnjsService> _dotNetRef;

        public TurnjsService(IJSRuntime jsRuntime)
        {
            _jsRuntime = jsRuntime;
        }

        public async Task InitializeAsync(string elementId, TurnjsOptions options)
        {
            _module = await _jsRuntime.InvokeAsync<IJSObjectReference>("import", "./_content/Maanfee.Turnjs/js/JsInterop.js");

            // اطمینان از بارگذاری وابستگی‌ها
            await _module.InvokeVoidAsync("ensureDependencies");

            _dotNetRef = DotNetObjectReference.Create(this);
            await _module.InvokeVoidAsync("initialize", elementId, options, _dotNetRef);
        }

        public async Task Next()
        {
            await _module.InvokeVoidAsync("next");
        }

        public async Task Previous()
        {
            await _module.InvokeVoidAsync("previous");
        }

        public async Task GoToPage(int pageNumber)
        {
            await _module.InvokeVoidAsync("goToPage", pageNumber);
        }

        public async Task<int> GetPageCount()
        {
            return await _module.InvokeAsync<int>("getPageCount");
        }

        public async Task<int> GetCurrentPage()
        {
            return await _module.InvokeAsync<int>("getCurrentPage");
        }

        #region - Events PageChanged -

        public event Action<int, bool> OnPageChanged;

        [JSInvokable]
        public void PageChanged(int pageNumber, bool isSinglePageView)
        {
            OnPageChanged?.Invoke(pageNumber, isSinglePageView);
        }

        #endregion

        #region - Events PageChanging -

        public event Func<int, Task> OnPageChanging;

        [JSInvokable]
        public async Task PageChanging(int newPage)
        {
            if (OnPageChanging != null)
            {
                await OnPageChanging.Invoke(newPage);
            }
        }

        #endregion

        public async ValueTask DisposeAsync()
        {
            if (_module != null)
            {
                //    await _module.InvokeVoidAsync("dispose");
                //    await _module.DisposeAsync();
            }
            //_dotNetRef?.Dispose();
            await Task.Delay(100);
        }

        public async Task<WindowDimensions> GetWindowDimensions()
        {
            return await _jsRuntime.InvokeAsync<WindowDimensions>("GetWindowDimensions");
        }
    }
}
