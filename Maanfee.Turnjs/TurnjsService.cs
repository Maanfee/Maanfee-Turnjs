using Maanfee.JsServices;
using Microsoft.JSInterop;
using System.Reflection;

namespace Maanfee.Turnjs
{
    public class TurnjsService : JsService, IAsyncDisposable
    {
        public TurnjsService(IJSRuntime JSRuntime) : base(JSRuntime, "Maanfee.Turnjs")
        {
        }

        protected DotNetObjectReference<TurnjsService> _DotNetRef;

        public new async ValueTask DisposeAsync()
        {
            if (!IsDisposed)
            {
                if (_Module != null)
                {
                    await _Module.InvokeVoidAsync("dispose");
                    await _Module.DisposeAsync();
                }

                _DotNetRef?.Dispose();
                _DotNetRef = null;

                await base.DisposeAsync();
            }
        }

        // ********************************************

        public async Task InitializeAsync(string elementId, TurnjsOptions options)
        {
            // اطمینان از بارگذاری وابستگی‌ها
            await EnsureModuleLoaded();

            _DotNetRef = DotNetObjectReference.Create(this);
            await _Module.InvokeVoidAsync("initialize", elementId, options, _DotNetRef);
        }


        public async Task Next()
        {
            await _Module.InvokeVoidAsync("next");
        }

        public async Task Previous()
        {
            await _Module.InvokeVoidAsync("previous");
        }

        public async Task GoToPage(int pageNumber)
        {
            await _Module.InvokeVoidAsync("goToPage", pageNumber);
        }

        public async Task<int> GetPageCount()
        {
            return await _Module.InvokeAsync<int>("getPageCount");
        }

        public async Task<int> GetCurrentPage()
        {
            return await _Module.InvokeAsync<int>("getCurrentPage");
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

        // ********************************************

        public async Task PrintAsync()
        {
            if (_Module != null)
            {
                await _Module.InvokeVoidAsync("openPrintWindow");
            }
        }
    }
}
