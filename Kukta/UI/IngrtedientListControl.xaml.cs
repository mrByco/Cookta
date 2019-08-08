using Cooktapi.Food;
using Cooktapi.Measuring;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
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

// The User Control item template is documented at https://go.microsoft.com/fwlink/?LinkId=234236

namespace Kukta.UI
{
    public sealed partial class IngrtedientListControl : UserControl, INotifyPropertyChanged
    {
        public IngrtedientListControl()
        {
            this.InitializeComponent();

        }
        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
        private bool m_EditMode;
        public bool EditMode
        {
            get
            {
                return m_EditMode;
            }
            set
            {
                m_EditMode = value;
                OnPropertyChanged("EditMode");
            }
        }

        private IngredientType adderType;
        private double? adderValue;
        private Unit adderUnit
        {
            get
            {
                return UnitSelector.SelectedItem as Unit;
            }
            set
            {
                UnitSelector.SelectedItem = value;
            }
        }

        private readonly ObservableCollection<Ingredient> m_Ingredients = new ObservableCollection<Ingredient>();
        private ObservableCollection<Ingredient> Ingredients { get { return m_Ingredients; } }

        private readonly ObservableCollection<Unit> m_AvailableUnits = new ObservableCollection<Unit>();
        private ObservableCollection<Unit> Units { get { return m_AvailableUnits; } }

        private readonly ObservableCollection<IngredientType> m_AvailableTypes = new ObservableCollection<IngredientType>();
        private ObservableCollection<IngredientType> AvailableTypes { get { return m_AvailableTypes; } }

        public async void SetItems(List<Ingredient> ingredients)
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                m_Ingredients.Clear();
                foreach (Ingredient ing in ingredients)
                {
                    m_Ingredients.Add(ing);
                }
            });
        }
        public async void SetAvailableTypes(List<IngredientType> types)
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                m_AvailableTypes.Clear();
                foreach (IngredientType type in types)
                {
                    m_AvailableTypes.Add(type);
                }
            });
        }
        public async void SetAvailableUnits(List<Unit> units)
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                m_AvailableUnits.Clear();
                foreach (Unit unit in units)
                {
                    m_AvailableUnits.Add(unit);
                }
            });
        }
        public List<Ingredient> GetIngredients()
        {
            return m_Ingredients.ToList();
        }

        private void valueTextBox_TextChanged(object sender, TextChangedEventArgs args)
        {
            TextBox textBox = sender as TextBox;
            try
            {
                if (textBox.Text == "")
                {
                    adderValue = null;
                    return;
                }
                string s = textBox.Text.Replace('.', ',');
                if (s.StartsWith(','))
                    s = "0" + s;
                if (s.EndsWith(','))
                {
                    s = s + "0";
                }
                double newValue = Double.Parse(s);
                adderValue = newValue;
            }
            catch (FormatException e)
            {
                textBox.Text = adderValue.ToString();
            }
            UpdateAdderButtonEnabled();
        }
        private void UpdateAdderButtonEnabled()
        {
            AddButton.IsEnabled = adderType != null && adderValue != null && adderUnit != null;
        }

        private void unitComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            UpdateAdderButtonEnabled();
        }

        private void autoSuggestBox_QuerySubmitted(AutoSuggestBox sender, AutoSuggestBoxQuerySubmittedEventArgs args)
        {

            IngredientType type = IngredientType.Search(1, args.QueryText).Find((ingType) => { return ingType.Name == args.QueryText; });
            if (type != null)
            {
                ChooseIngredientType(type);
            }
            else
            {
                sender.Text = adderType.Name;
            }
        }
        private void AddIngrdient(object sender, RoutedEventArgs e)
        {
            Ingredients.Add(new Ingredient(adderType, (double)adderValue, adderUnit));
            adderType = null;
            IngredientSuggestionBox.Text = "";
            adderUnit = null;
            adderValue = null;
            ValueTextBox.Text = "";
        }


        private void ChooseIngredientType(IngredientType IngType)
        {
            adderType = IngType;
            SetAvailableUnits(IngType.GetUnits());
            if (!m_AvailableUnits.Contains(adderUnit))
            {
                adderUnit = null;
            }
            UpdateAdderButtonEnabled();
        }

        private void autoSuggestBox_TextChanged(AutoSuggestBox sender, AutoSuggestBoxTextChangedEventArgs args)
        {
            var result = IngredientType.Search(8, sender.Text);
            sender.ItemsSource = result;
            if (result.Find((i) => { return IsAccessKeyScope.ToString() == sender.Text; }) != null)
            {
                adderType = result.Find((i) => { return IsAccessKeyScope.ToString() == sender.Text; });
            }
        }

        private void removeBTNClick(Ingredient ing)
        {
            Ingredients.Remove(ing);
        }

        private void ListView_ItemClick(object sender, ItemClickEventArgs e)
        {
            Flyout flyout = new Flyout();

            StackPanel flyoutStack = new StackPanel() { Orientation = Orientation.Vertical, Spacing = 10, Margin = new Thickness(10) };
            flyout.Content = flyoutStack;

            TextBlock title = new TextBlock() { Text = "Biztos törlöd?", FontSize = 20, HorizontalAlignment = HorizontalAlignment.Left };
            flyoutStack.Children.Add(title);


            StackPanel buttonsStack = new StackPanel() { Orientation = Orientation.Horizontal, Spacing = 10 };
            flyoutStack.Children.Add(buttonsStack);

            Button AcceptBTN = new Button() { Content = "Törlés" };
            buttonsStack.Children.Add(AcceptBTN);
            AcceptBTN.Click += (s, args) => { removeBTNClick(e.ClickedItem as Ingredient); } ;
            AcceptBTN.Click += (s, args) => { flyout.Hide(); };

            Button CancelBTN = new Button() { Content = "Mégse" };
            buttonsStack.Children.Add(CancelBTN);
            CancelBTN.Click += (s, args) => { flyout.Hide(); };

            flyout.ShowAt(sender as FrameworkElement);
        }
    }
    class EditBool : INotifyPropertyChanged
    {
        private bool m_edit;
        public bool EditMode
        {
            get
            {
                return m_edit;
            }
            set
            {
                OnPropertyChanged("EditMode");
                m_edit = value;
            }
        }
        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
