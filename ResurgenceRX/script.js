const tabs = document.querySelectorAll('.j-tab');

tabs.forEach(tab => {
  tab.addEventListener('click', function() {
    const tabName = this.getAttribute('data-tab');
    
    const parentCard = this.closest('.j-card');
    
    const cardTabs = parentCard.querySelectorAll('.j-tab');
    const cardPanes = parentCard.querySelectorAll('.j-pane');
    const cardImages = parentCard.querySelectorAll('.j-card-image');
    const cardTag = parentCard.querySelector('.j-tag');
    
    cardTabs.forEach(t => t.classList.remove('j-tab-active'));
    
    this.classList.add('j-tab-active');
    
    cardPanes.forEach(pane => pane.classList.remove('j-pane-active'));
    
    const activePane = parentCard.querySelector(`[data-pane="${tabName}"]`);
    if (activePane) {
      activePane.classList.add('j-pane-active');
    }
    
    cardImages.forEach(img => img.classList.remove('j-card-image-active'));
    
    const activeImage = parentCard.querySelector(`[data-image="${tabName}"]`);3
    if (activeImage) {
      activeImage.classList.add('j-card-image-active');
    }
    
  });
});  