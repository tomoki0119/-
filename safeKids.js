document.addEventListener("DOMContentLoaded", function() {
    // ページ読み込み時に、メニュー以外のセクションを非表示にする
    hideAllSectionsExcept("problem");

    // メニュー項目がクリックされたときに対応するセクションを表示する
    var menuItems = document.querySelectorAll("#menu a");
    menuItems.forEach(function(item) {
        item.addEventListener("click", function(event) {
            event.preventDefault(); // リンクのデフォルトの挙動を無効化
            var targetSectionId = item.getAttribute("href").substring(1);
            hideAllSectionsExcept(targetSectionId);
        });
    });

    function hideAllSectionsExcept(sectionId) {
        var sections = document.querySelectorAll("section");
        sections.forEach(function(section) {
            if (section.id === sectionId) {
                section.style.display = "block";
            } else {
                section.style.display = "none";
            }
        });
    }
});