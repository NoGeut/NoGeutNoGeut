document.addEventListener('DOMContentLoaded', function() {
    const filterForm = document.getElementById('filterForm');

    // Helper function to set the value of a hidden input
    function setHiddenValue(inputId, value) {
        document.getElementById(inputId).value = value;
    }

    // Event listener for main nav items
    document.getElementById('a').addEventListener('click', function(event) {
        event.preventDefault();
        toggleDropdown('a-dropdown');
    });

    // Generalized event listener for region and city dropdowns
    function addRegionEventListeners(regionClass, dropdownId) {
        document.querySelectorAll(`.${regionClass}`).forEach(item => {
            item.addEventListener('click', function(event) {
                event.preventDefault();
                toggleSelectedItem(item);
                ensureDropdownVisible(dropdownId);
            });

            item.addEventListener('mouseover', function(event) {
                ensureDropdownVisible(dropdownId);
            });

            item.addEventListener('mouseleave', function(event) {
                hideDropdownWithDelay(dropdownId, regionClass);
            });
        });

        document.querySelectorAll(`#${dropdownId} .dropdown-child li a`).forEach(item => {
            item.addEventListener('click', function(event) {
                event.preventDefault();
                const city = item.textContent.trim();
                setHiddenValue('city', city);
                toggleSelectedItem(item);
                ensureDropdownVisible('b-dropdown');
            });
        });
    }

    // Add event listeners for all regions
    addRegionEventListeners('a-seoul', 'seoul-dropdown');
    addRegionEventListeners('a-gyeonggi', 'gyeonggi-dropdown');
    addRegionEventListeners('a-busan', 'busan-dropdown');
    addRegionEventListeners('a-daegu', 'daegu-dropdown');
    addRegionEventListeners('a-daejeon', 'daejeon-dropdown');
    addRegionEventListeners('a-ulsan', 'ulsan-dropdown');
    addRegionEventListeners('a-sejong', 'sejong-dropdown');
    addRegionEventListeners('a-gangwon', 'gangwon-dropdown');
    addRegionEventListeners('a-chungbuk', 'chungbuk-dropdown');
    addRegionEventListeners('a-chungnam', 'chungnam-dropdown');
    addRegionEventListeners('a-jeonbuk', 'jeonbuk-dropdown');
    addRegionEventListeners('a-jeonnam', 'jeonnam-dropdown');
    addRegionEventListeners('a-gyeongbuk', 'gyeongbuk-dropdown');
    addRegionEventListeners('a-gyeongnam', 'gyeongnam-dropdown');
    addRegionEventListeners('a-jeju', 'jeju-dropdown');

    // Event listener for gender dropdown items
    document.querySelectorAll('.b-item').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const gender = item.textContent === '전체' ? '' : item.textContent;
            setHiddenValue('gender', gender);
            toggleSelectedItem(item);
            ensureDropdownVisible('c-dropdown');
        });
    });

    // Event listener for amount dropdown items
    document.querySelectorAll('.c-item').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const amount = item.textContent === '전체' ? '' :
                           item.textContent === '무료' ? '0' :
                           item.textContent === '1만원' ? '10000' :
                           item.textContent === '3만원' ? '30000' :
                           item.textContent === '5만원' ? '50000' : '';
            setHiddenValue('amount', amount);
            toggleSelectedItem(item);
            ensureDropdownVisible('f-dropdown');
        });
    });

    // Event listener for day dropdown items
    document.querySelectorAll('.f-item').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const day = item.textContent === '전체' ? '' : item.textContent;
            setHiddenValue('day', day);
            toggleSelectedItem(item);
            ensureDropdownVisible('g-dropdown');
        });
    });

    // Event listener for time dropdown items
    document.querySelectorAll('.g-item').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const time = item.textContent;
            setHiddenValue('time', time);
            toggleSelectedItem(item);
        });
    });

    // Function to toggle dropdown visibility
    function toggleDropdown(id) {
        const dropdown = document.getElementById(id);
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }

    // Function to ensure dropdown is visible
    function ensureDropdownVisible(id) {
        const dropdown = document.getElementById(id);
        if (dropdown) {
            dropdown.classList.add('show');
        }
    }

    // Function to hide dropdown
    function hideDropdown(id) {
        const dropdown = document.getElementById(id);
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }

    // Function to toggle selected item
    function toggleSelectedItem(item) {
        item.classList.toggle('nav-selected');
    }

    // Function to hide dropdown with delay
    function hideDropdownWithDelay(id, triggerClass) {
        setTimeout(() => {
            const dropdown = document.getElementById(id);
            const triggerElement = document.querySelector(`.${triggerClass}`);
            if (dropdown && triggerElement && !dropdown.matches(':hover') && !triggerElement.matches(':hover')) {
                dropdown.classList.remove('show');
            }
        }, 200);
    }

    // Add event listener to search button
    document.getElementById('searchButton').addEventListener('click', function() {
        updateHiddenInputs();
        filterForm.submit();
    });

    // Function to update hidden inputs based on selected items
    function updateHiddenInputs() {
        document.getElementById('region').value = getSelectedText('a-item');
        document.getElementById('city').value = getSelectedText('seoul-item') || getSelectedText('gyeonggi-item');
        document.getElementById('gender').value = getSelectedText('b-item');
        document.getElementById('amount').value = getSelectedText('c-item');
        document.getElementById('day').value = getSelectedText('f-item');
        document.getElementById('time').value = getSelectedText('g-item');
    }

    // Function to get selected text from dropdown
function getSelectedText(className) {
    const selectedItem = document.querySelector(`.${className}.nav-selected`);
    return selectedItem ? selectedItem.textContent.trim() : '';
}
});

