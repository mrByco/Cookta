using Kukta.FoodFrameworkV2;
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

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Kukta.Screens
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class IngredientPage : Page
    {
        public IngredientPage()
        {
            this.InitializeComponent();
        }

        private void Page_Loaded(object sender, RoutedEventArgs e)
        {
            RefreshData();
        }
        private async void RefreshData()
        {
            await SetLoading(true);
            await IngredientType.Init();
            dataGrid.ItemsSource = IngredientType.Types;
            await SetLoading(false);

        }

        private async void EditIngredient_Click(object sender, RoutedEventArgs e)
        {
            await EditIngredient((sender as Button).Tag as string);
        }
        private async Task EditIngredient(string ID)
        {
            OpenIngredientToDialog(ID);
            var result = await EditIngredientContentDialog.ShowAsync();
        }
        private void OpenIngredientToDialog(string ID)
        {
            SetLoadingInDialog(true);
            var ing = IngredientType.GetByID(ID);
            if (ing != null)
            {
                EditNameTextBlock.Text = ing.Name;
                EditIDTextBlock.Text = ing.ID;
                EditCategorySuggestionBox.Text = ing.Category;
                EditCategorySuggestionBox.ItemsSource = IngredientType.GetCurrentUsetIngredientCategories();
                EditCountEnabledCheckBox.IsChecked = ing.CountEnabled;
                EditVolumeEnabledCheckBox.IsChecked = ing.VolumeEnabled;
                EditMassEnabledCheckBox.IsChecked = ing.MassEnabled;
                EditIngredientCustomUnitsDataGrid.ItemsSource = EditingUnit.FromUnitList(ing.CustomUnits);
            }
            else
            {
                EditNameTextBlock.Text = "";
                EditIDTextBlock.Text = Guid.NewGuid().ToString();
                EditCategorySuggestionBox.Text = "";
                EditCategorySuggestionBox.ItemsSource = IngredientType.GetCurrentUsetIngredientCategories();
                EditCountEnabledCheckBox.IsChecked = false;
                EditVolumeEnabledCheckBox.IsChecked = false;
                EditMassEnabledCheckBox.IsChecked = false;
                EditIngredientCustomUnitsDataGrid.ItemsSource = new List<EditingUnit>();
            }
            SetLoadingInDialog(false);
        }
        private void SetLoadingInDialog(bool Loading)
        {
            DialogData.Visibility = Loading ? Visibility.Collapsed : Visibility.Visible;
            DialogLoading.Visibility = !Loading ? Visibility.Collapsed : Visibility.Visible;
        }

        private void EditCategorySuggestionBox_TextChanged(AutoSuggestBox sender, AutoSuggestBoxTextChangedEventArgs args)
        {

        }

        private void DialogCancel_Click(object sender, RoutedEventArgs e)
        {
            EditIngredientContentDialog.Hide();
        }

        private void DialogSaveBTN_Click(object sender, RoutedEventArgs e)
        {
            EditIngredientContentDialog.Hide();
            SetLoading(true);
#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
            IngredientType.Save(new IngredientType(
                (bool)EditMassEnabledCheckBox.IsChecked,
                (bool)EditVolumeEnabledCheckBox.IsChecked,
                (bool)EditCountEnabledCheckBox.IsChecked,
                EditNameTextBlock.Text,
                EditIDTextBlock.Text,
                EditCategorySuggestionBox.Text,
                EditingUnit.ToUnits(EditIngredientCustomUnitsDataGrid.ItemsSource as List<EditingUnit>)));
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
            RefreshData();
        }

        private async Task SetLoading(bool Loading)
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                dataGrid.Visibility = Loading ? Visibility.Collapsed : Visibility.Visible;
                loadingRing.Visibility = !Loading ? Visibility.Collapsed : Visibility.Visible;
            });
        }

        private async void AddUnitDialog_Click(object sender, RoutedEventArgs e)
        {
            List<EditingUnit> units = new List<EditingUnit>();
            units.AddRange(EditIngredientCustomUnitsDataGrid.ItemsSource as List<EditingUnit>);
            units.Add(new EditingUnit());
            EditIngredientCustomUnitsDataGrid.ItemsSource = units;
        }
    }
    public class EditingUnit
    {
        public UnitType Type { get; set; }
        public double ToBase { get; set; }
        public string Name { get; set; }
        public string id { get; private set; }
        public string ShortName { get; set; }
        public bool IsValid
        {
            get
            {
                return Name != null && Name != "" && id != "";
            }
        }

        public EditingUnit()
        {
            id = Guid.NewGuid().ToString();
            Name = "";
            Type = UnitType.Count;
            ShortName = "";
            ToBase = 0;
        }
        public EditingUnit(Unit unit)
        {
            id = unit.id;
            Type = unit.Type;
            ToBase = unit.ToBase;
            Name = unit.Name;
            ShortName = unit.ShortName;
        }
        public static List<EditingUnit> FromUnitList(List<Unit> units)
        {
            List<EditingUnit> eUnits = new List<EditingUnit>();
            foreach (Unit unit in units)
            {
                eUnits.Add(new EditingUnit(unit));
            }
            return eUnits;
        }
        public static List<Unit> ToUnits(List<EditingUnit> eUnits)
        {
            List<Unit> units = new List<Unit>();
            foreach (EditingUnit eUnit in eUnits)
            {
                if (eUnit.IsValid)
                {
                    units.Add(eUnit.ToUnit());
                }
            }
            return units;
        }
        public Unit ToUnit()
        {
            return new Unit(Type, ToBase, Name, ShortName, id);
        }
    }
}
