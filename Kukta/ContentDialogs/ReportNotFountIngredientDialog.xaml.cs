using Kukta.FrameWork;
using Kukta.UI;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
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

namespace Kukta.ContentDialogs
{
    public sealed partial class ReportNotFountIngredientDialog : ContentDialog
    {
        public ReportNotFountIngredientDialog()
        {
            this.InitializeComponent();
        }

        private async void ContentDialog_SendButtonClick(ContentDialog sender, ContentDialogButtonClickEventArgs args)
        {
            var query = new Dictionary<string, object>();
            query.Add("message", MessageTextBox.Text);
            query.Add("ing", IngredientNameTextBox.Text);
            var res = await Networking.GetRequestSimple("ingredientreport", query);
            if (res.StatusCode != System.Net.HttpStatusCode.OK)
            {
                App.Sendnotification("Hiba", "Ismeretlen hiba lépett fel a jelentés küldésekor, ha a hiba nem oldódik meg vedd fel velünk a kapcsolatot.");
            }
            else
            {
                App.Sendnotification("Köszönjük a visszajelzés", "A Kért hozzávaló hamarosan bekerül az adatbázisba!");
            }
        }

        private void ContentDialog_CancelButtonClick(ContentDialog sender, ContentDialogButtonClickEventArgs args)
        {

        }
    }
}
