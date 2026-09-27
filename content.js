(function() {
  console.log("[AI Studio Auto High Thinking] Extension loaded and watching for 'Medium' thinking level...");

  let isChanging = false;

  function checkAndChangeThinkingLevel() {
    if (isChanging) return;

    // Find the specific component for the thinking level setting
    const settingBlock = document.querySelector('ms-thinking-level-setting');
    if (!settingBlock) return;

    // Read the current selected value
    const valueTextEl = settingBlock.querySelector('.mat-mdc-select-value-text');
    if (!valueTextEl) return;

    const currentValue = valueTextEl.textContent.trim();
    if (currentValue !== 'Medium') return;

    // The value is 'Medium', we need to change it to 'High'
    console.log("[AI Studio Auto High Thinking] Detected 'Medium' thinking level. Switching to 'High'...");
    isChanging = true;

    // Locate the select dropdown trigger
    const selectElement = settingBlock.querySelector('mat-select') || settingBlock.querySelector('[role="combobox"]');
    if (selectElement) {
        // Open the dropdown
        selectElement.click(); 

        // Wait for Angular CDK overlay dropdown options to render in the DOM
        setTimeout(() => {
            const options = Array.from(document.querySelectorAll('mat-option, [role="option"]'));
            const highOption = options.find(opt => opt.textContent.trim() === 'High');

            if (highOption) {
                highOption.click();
                console.log("[AI Studio Auto High Thinking] Successfully clicked 'High'.");
            } else {
                console.error("[AI Studio Auto High Thinking] 'High' option not found in dropdown.");
                // Cleanup: click body to close the orphaned overlay if High wasn't found
                document.body.click();
            }

            // Cooldown to prevent any rapid re-triggering while UI settles
            setTimeout(() => {
                isChanging = false;
            }, 1000);

        }, 150); // 150ms delay for UI rendering and animation
    } else {
        isChanging = false;
    }
  }

  // Observe the body for changes since the UI updates dynamically
  const observer = new MutationObserver(() => {
      checkAndChangeThinkingLevel();
  });

  observer.observe(document.body, { childList: true, subtree: true, characterData: true });

  // Initial check on load
  setTimeout(checkAndChangeThinkingLevel, 2000);
})();