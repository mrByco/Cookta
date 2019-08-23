using Cooktapi.Reporting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Content Dialog item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Kukta.UI.Dialogs
{
    public sealed partial class SendReportDialog : ContentDialog
    {
        public SendReportDialog()
        {
            this.InitializeComponent();
            Subject = "";
            Desc = "";
            Message = "";
        }
        public string Subject { get; set; }
        public string Desc { get; set; }
        public string Message { get; set; }


        private async void ContentDialog_PrimaryButtonClick(ContentDialog sender, ContentDialogButtonClickEventArgs args)
        {
            await Reporter.Report(Subject, Desc, Message);
        }

        private async void DoReport()
        {
        }

        private void ContentDialog_SecondaryButtonClick(ContentDialog sender, ContentDialogButtonClickEventArgs args)
        {
        }
    }
}
