using Microsoft.AspNetCore.Components;

namespace Maanfee.Turnjs
{
    public class TurnjsPage
    {
        public string PageTitle { get; set; } = string.Empty;
        public string PageContent { get; set; } = string.Empty;
        public string PageFooter { get; set; } = string.Empty;
        public string CssClass { get; set; } = string.Empty;

        public RenderFragment<TurnjsPage> TitleTemplate { get; set; }
        public RenderFragment<TurnjsPage> ContentTemplate { get; set; }
        public RenderFragment<TurnjsPage> FooterTemplate { get; set; }

        public object Data { get; set; }
        public bool IgnorePage { get; set; } = false;
        public bool PageToolbar { get; set; } = true;

        public string Style { get; set; }

        public PageType PageType { get; set; }

        private string PageTypeString => PageType switch
        {
            PageType.FrontCover => "FrontCover",
            PageType.FrontCover_Back => "FrontCover_Back",
            PageType.BackCover_Back => "BackCover_Back",
            PageType.BackCover => "BackCover",
            _ => ""
        };

        public bool IsPageMirror { get; set; } = false;

        public bool IsLoaded { get; set; } = true;
        public Func<TurnjsPage, Task> LoadContentAsync { get; set; }
    }
}
