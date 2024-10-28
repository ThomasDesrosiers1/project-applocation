import Icons from './utils/Icons';
import ComponentFactory from './ComponentFactory';

class Main {
  constructor() {
    this.init();
    this.multipleStepsForm();
  }

  init() {
    Icons.load();

    document.documentElement.classList.add('has-js');

    new ComponentFactory();
  }

  multipleStepsForm() {
    let currentTab = 0;

    let packagePrice = 0;
    let totalSeo = 0;
    let totalLocation = 0;
    let totalBought = 900;
    let discount = 0;

    const totalSeoValues = [];
    const totalLocationValues = [];
    const totalBoughtValues = [];

    const finalPricesRows = document.querySelectorAll('.row.additionnal');
    const morePlaces = document.querySelector('.row.place');
    morePlaces.style.display = 'none';

    const tabs = document.querySelectorAll('.tab');
    const packageChoices = document.querySelectorAll('.btn.check');
    const gmbInput = document.querySelector('input[type=checkbox].gmb');

    const newClientRadio = document.querySelector('input[type=radio].new');
    const oldClientRadio = document.querySelector('input[type=radio].old');
    const newClientNumberField = document.querySelector(
      '.quantity-group.discount .number-field'
    );
    const newClientQuantityInput = document.querySelector(
      'input[type=number].new'
    );

    function storeInputNumberValue() {
      document.querySelectorAll('input[type=number]').forEach(function (input) {
        input.addEventListener('click', function () {
          this.setAttribute('value', this.value);
        });
      });
    }

    function handlePackageSelection() {
      packageChoices.forEach((pack, index) => {
        pack.addEventListener('click', function () {
          const isSelected = pack.classList.contains('selected');

          // Supprimer la sélection de tous les packages
          packageChoices.forEach((p) => p.classList.remove('selected'));

          if (isSelected) {
            handlePackagePrice(null);
            showSelectedPackage(-1);

            gmbInput.checked = false;
            gmbInput.disabled = false;
          } else {
            // Sinon, sélectionner le package
            pack.classList.add('selected');
            const selectedInput = pack.querySelector('input[type=radio]');
            handlePackagePrice(selectedInput);

            if (selectedInput.classList.contains('gmb')) {
              gmbInput.checked = true;
              gmbInput.disabled = true;
            } else {
              gmbInput.checked = false;
              gmbInput.disabled = false;
            }

            // Afficher le bon package dans la dernière tab
            showSelectedPackage(index);
          }
        });
      });
    }

    function handlePackagePrice(option) {
      if (option) {
        const value = parseInt(option.value);
        totalLocation -= packagePrice;
        packagePrice = value;
        totalLocation += packagePrice;
      } else {
        // Si aucun package n'est sélectionné
        totalLocation -= packagePrice;
        packagePrice = 0; // Réinitialiser le prix du package
      }

      storeCurrentValues();
      updatePrices();
    }

    function showSelectedPackage(index) {
      // Cacher toutes les divs de packages
      document.querySelectorAll('.package-details').forEach((div) => {
        div.classList.remove('selected');
      });

      if (index >= 0) {
        // Afficher la div correspondant à l'index du package sélectionné
        if (index === 0) {
          document.querySelector('.starter').classList.add('selected');
        } else if (index === 1) {
          document.querySelector('.popular').classList.add('selected');
        } else if (index === 2) {
          document.querySelector('.expert').classList.add('selected');
        }
      }
    }

    // Fonction pour gérer l'affichage du champ number lorsqu'un checkbox est sélectionné
    function handleCheckboxNumberField(event) {
      const checkbox = event.target;
      const parentDiv = checkbox.closest('.quantity-group');
      const numberContainer = parentDiv.querySelector('.number-field');
      const quantityInput = numberContainer.querySelector('input[type=number]');

      // Afficher ou cacher le container number en fonction de l'état du checkbox
      if (checkbox.checked) {
        numberContainer.classList.add('selected');
        quantityInput.value = '1';
        multiplyByQuantity(quantityInput);
      } else {
        numberContainer.classList.remove('selected');

        // Soustraire la valeur actuelle avant de réinitialiser
        const inputDataTotalBought =
          parseInt(quantityInput.dataset.boughtsum, 10) || 0;
        const inputDataTotalLocation =
          parseInt(quantityInput.dataset.locationsum, 10) || 0;

        totalBought -= inputDataTotalBought;
        totalLocation -= inputDataTotalLocation;

        storeCurrentValues();

        // Réinitialiser le champ number et le total stocké
        quantityInput.value = '0';
        quantityInput.dataset.boughtsum = '0';
        quantityInput.dataset.locationsum = '0';
      }

      morePlaces.style.display = 'none';
      updatePrices();
    }

    function handleClientNumberField() {
      // Gérer l'état du champ number en fonction du radio button sélectionné
      if (newClientRadio.checked) {
        newClientNumberField.classList.add('selected');
        newClientQuantityInput.value = '1'; // Optionnel : définir une valeur par défaut
      } else if (oldClientRadio.checked) {
        newClientNumberField.classList.remove('selected');
      }

      calculateDiscountedPrices(); // Appliquer les rabais après avoir manipulé les champs

      storeCurrentValues();
      updatePrices();
    }

    function handleAdditionnalRow(event) {
      const choice = event.target;
      const optionId = choice.id; // Utiliser l'ID de l'option comme identifiant unique

      const rowsContainer = document.querySelector('.rows-container');

      // Rechercher s'il existe déjà une ligne associée à cette option
      let additionnalRow = document.querySelector(
        `.additionnal[data-option-id="${optionId}"]`
      );

      // Si l'option est cochée et qu'il n'y a pas encore de ligne, on en crée une
      if (choice.checked && !additionnalRow) {
        additionnalRow = document.createElement('div');
        additionnalRow.setAttribute('class', 'row additionnal');
        additionnalRow.setAttribute('data-option-id', optionId);

        const option = document.createElement('div');
        option.setAttribute('class', 'option');

        const optionImg = document.createElement('img');
        optionImg.setAttribute('src', 'assets/icons/icon_check_selected.svg');

        const optionName = document.createElement('div');
        optionName.setAttribute('class', 'option-name');

        const service = document.createElement('p');
        service.setAttribute('class', 'service');

        const price = document.createElement('div');
        price.setAttribute('class', 'price');

        option.appendChild(optionImg);
        option.appendChild(optionName);
        additionnalRow.appendChild(option);
        additionnalRow.appendChild(service);
        additionnalRow.appendChild(price);
        rowsContainer.appendChild(additionnalRow);
      }

      // Si l'option est cochée, on met à jour la ligne avec les valeurs correspondantes
      if (choice.checked) {
        // Accéder au texte du label associé à l'input
        const label = choice.closest('.check-container').querySelector('label');
        const priceInfo = choice
          .closest('.check-container')
          .querySelector('.price-info');

        // Remplir la structure HTML
        additionnalRow.querySelector('.option .option-name').textContent =
          label.innerText;
        additionnalRow.querySelector('.service').textContent =
          priceInfo.innerText;
        additionnalRow.querySelector('.price').textContent =
          choice.value + '$/mois';
        additionnalRow.classList.add('selected');
      } else if (additionnalRow) {
        // Si l'option est décochée, on supprime la ligne correspondante
        additionnalRow.remove();
      }
    }

    function calculateFixedPrice(option) {
      const value = parseInt(option.value);

      if (option.checked) {
        totalBought += value;
      } else {
        totalBought -= value;
      }

      storeCurrentValues();
      updatePrices();
    }

    function calculateLocationPrice(option) {
      const value = parseInt(option.value);

      if (option.checked) {
        if (option.classList.contains('seo')) {
          totalSeo += value;
        } else {
          totalLocation += value;
        }
      } else {
        if (option.classList.contains('seo')) {
          totalSeo -= value;
        } else {
          totalLocation -= value;
        }
      }

      storeCurrentValues();
      updatePrices();
    }

    function applyNewClientDiscount() {
      // Appliquer le rabais personnalisé
      const discountPercentage = parseInt(newClientQuantityInput.value, 10);
      const discountFactor = (100 - discountPercentage) / 100;

      // Appliquer le rabais
      totalBought = parseFloat((totalBought * discountFactor).toFixed(2));
      totalLocation = parseFloat((totalLocation * discountFactor).toFixed(2));
      totalSeo = parseFloat((totalSeo * discountFactor).toFixed(2));
    }

    function applyOldClientSeoDiscount() {
      const seoPro = document.querySelector('input[type=checkbox].seo.pro');
      const seoCombination = document.querySelector('input[type=number].seo');

      seoPro.value = parseFloat(seoPro.value || 0) * 0.85;
      seoCombination.dataset.seo =
        parseFloat(seoCombination.dataset.seo || 0) * 0.85;

      const discountFactor = 0.85; // 15% de rabais
      const seoDiscount = totalSeo * (1 - discountFactor);
      totalSeo -= seoDiscount;
    }

    function calculateDiscountedPrices() {
      const discountIndex = parseInt(newClientQuantityInput.value, 10);

      if (newClientRadio.checked) {
        applyNewClientDiscount();
      } else if (oldClientRadio.checked) {
        totalSeo = totalSeoValues[totalSeoValues.length - discountIndex - 1];
        totalLocation =
          totalLocationValues[totalLocationValues.length - discountIndex - 1];
        totalBought =
          totalBoughtValues[totalBoughtValues.length - discountIndex - 1];

        newClientNumberField.value = '0';

        applyOldClientSeoDiscount();
      }

      console.log(
        'Achat après rabais: ' + totalBought + '       ',
        'Seo après rabais: ' + totalSeo + '       ',
        'Location après rabais: ' + totalLocation + '       '
      );
      updatePrices();
    }

    function multiplyByQuantity(quantityInput) {
      // Convertir les valeurs en nombres
      const quantity = parseInt(quantityInput.value, 10) || 0;
      const inputDataSeo = parseInt(quantityInput.dataset.seo, 10) || 0;
      const inputDataLocation =
        parseInt(quantityInput.dataset.location, 10) || 0;
      const inputDataBought = parseInt(quantityInput.dataset.bought, 10) || 0;

      // Si la quantité n'est pas un nombre valide, définir la valeur par défaut à 0
      if (
        isNaN(quantity) ||
        isNaN(inputDataBought) ||
        isNaN(inputDataLocation) ||
        isNaN(inputDataSeo)
      ) {
        return; // Sortir de la fonction si une valeur est invalide
      }

      // Soustraire le montant précédent pour recalculer
      totalSeo -= parseInt(quantityInput.dataset.seosum || 0);
      totalLocation -= parseInt(quantityInput.dataset.locationsum || 0);
      totalBought -= parseInt(quantityInput.dataset.boughtsum || 0);

      let seosum = 0;
      let locationsum = 0;
      let boughtsum = 0;

      if (quantityInput.classList.contains('seo')) {
        seosum = inputDataSeo * quantity;
      } else if (quantity > 0 && quantityInput.classList.contains('place')) {
        morePlaces.style.display = 'grid';
        const firstPrice = inputDataBought;
        const additionalPrice = inputDataBought * 0.8;

        if (quantity === 1) {
          boughtsum = firstPrice;
        } else if (quantity > 1) {
          boughtsum = firstPrice + (quantity - 1) * additionalPrice;
        }
      } else {
        const buyingPrice = inputDataBought;
        const locationPrice = inputDataLocation;

        boughtsum = buyingPrice * quantity;
        locationsum = locationPrice * quantity;
      }

      quantityInput.dataset.seosum = seosum; // Enregistrer le total de location calculé pour ce checkbox
      quantityInput.dataset.locationsum = locationsum; // Enregistrer le total de location calculé pour ce checkbox
      quantityInput.dataset.boughtsum = boughtsum; // Enregistrer le total d'achat calculé pour ce checkbox

      document.querySelector('.place-price').textContent = boughtsum + '$';

      totalSeo += seosum;
      totalLocation += locationsum;
      totalBought += boughtsum;

      storeCurrentValues();
      updatePrices();
    }

    function storeCurrentValues() {
      totalSeoValues.push(totalSeo);
      totalLocationValues.push(totalLocation);
      totalBoughtValues.push(totalBought);
      console.log(totalSeoValues);

      console.log(
        'Total achat: ' + totalBought + '     ',
        'Total seo: ' + totalSeo + '       ',
        'Total location: ' + totalLocation
      );
    }

    function updatePrices() {
      let finalLocation = totalSeo + totalLocation;

      if (totalLocation === 0) {
        finalLocation = totalSeo;
      }
      if (newClientRadio.checked) {
        discount = newClientQuantityInput.value;
      }

      document.querySelector('.location .value').textContent =
        finalLocation + '$';
      document.querySelector('.bought .value').textContent = totalBought + '$';
      document.querySelector('.grand-total .value').textContent =
        totalBought + '$';
      document.querySelector('.discount-price').textContent = discount + '%';

      if (oldClientRadio.checked) {
        discount = 15;

        if (discount === 15) {
          document.querySelector('.discount-price').textContent =
            discount + '% SEO';
        }
      }
    }

    // Fonction pour naviguer à la prochaine ou précédente tab
    function nextPrev(tabIndex) {
      if (tabIndex > 0) {
        // Si on avance dans le formulaire
        window.scrollTo(0, 0);
        tabs[currentTab].style.display = 'none';
        currentTab += tabIndex;
        showTab(currentTab);
      } else {
        // Si on recule dans le formulaire
        tabs[currentTab].style.display = 'none';
        currentTab += tabIndex;
        showTab(currentTab);
      }
    }

    // Fonction pour afficher la tab spécifiée
    function showTab(tabIndex) {
      tabs.forEach((tab) => (tab.style.display = 'none'));
      tabs[tabIndex].style.display = 'block';
      currentTab = tabIndex;

      // Lorsqu'on revient à tab 1, vérifier l'état du package sélectionné
      if (tabIndex === 0) {
        const selectedPackage = document.querySelector(
          'input[name="package"]:checked'
        );
        if (selectedPackage) {
          selectedPackage.closest('.btn.check').classList.add('selected');
          handlePackagePrice(selectedPackage);
        }
      }
    }

    // Initialiser le formulaire en cachant toutes les tabs sauf la première
    function initializeForm() {
      tabs.forEach((tab) => (tab.style.display = 'none'));
      tabs[0].style.display = 'block';

      // Gestion des événements de clic sur les boutons "next-tab / prev-tab"
      document.querySelectorAll('.next-tab').forEach((button) => {
        button.addEventListener('click', () => nextPrev(1));
      });
      document.querySelectorAll('.prev-tab').forEach((button) => {
        button.addEventListener('click', () => nextPrev(-1));
      });
      document.querySelectorAll('.change-package').forEach((button) => {
        button.addEventListener('click', () => showTab(0));
      });
      document
        .querySelector('.modify')
        .addEventListener('click', () => nextPrev(-1));

      storeInputNumberValue();
      handlePackageSelection();

      storeCurrentValues();
      updatePrices();

      // Gestion des événements de changement d'état des inputs (radio, checkbox, number)
      tabs.forEach((tab) => {
        tab.addEventListener('change', (event) => {
          if (
            event.target.type === 'checkbox' &&
            event.target.classList.contains('location')
          ) {
            calculateLocationPrice(event.target);
            handleAdditionnalRow(event);
          }
          if (
            event.target.type === 'checkbox' &&
            event.target.classList.contains('fix')
          ) {
            calculateFixedPrice(event.target);
          }
          if (
            event.target.type === 'checkbox' &&
            event.target.classList.contains('number')
          ) {
            handleCheckboxNumberField(event);
          }
          if (
            event.target.type === 'radio' &&
            event.target.classList.contains('discount')
          ) {
            handleClientNumberField();
          }
          if (
            event.target.type === 'number' &&
            event.target.closest('.quantity-group.discount')
          ) {
            calculateDiscountedPrices();
          }
          if (
            event.target.type === 'number' &&
            event.target.closest('.quantity-group')
          ) {
            multiplyByQuantity(event.target);
          }
        });
      });
    }

    initializeForm();
  }
}
new Main();
