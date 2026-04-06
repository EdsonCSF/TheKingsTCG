const CampaignView = {

    getCampaignImage(campaignId){
        const map = {
            campaign_1: "prov-inicial",
            campaign_2: "gue-elementais",
            campaign_3: "cons-coroa",
            campaign_4: "tro-ancestrais"
        };

        return `img/icones/${map[campaignId] || campaignId}.png`;
    },

    render(){
        const container = document.getElementById("campaign-list");
        if(!container) return;

        container.innerHTML = "";

        if(!S.campaign) S.campaign = {};
        if(!S.campaign.unlocked) S.campaign.unlocked = ["campaign_1"];

        CAMPAIGNS.forEach((campaign) => {
            const unlocked = S.campaign.unlocked.includes(campaign.id);

            const btn = document.createElement("button");
            btn.className = "w-full mb-3 transition-transform hover:scale-105 active:scale-95";
            btn.style.background = "transparent";
            btn.style.border = "none";
            btn.style.outline = "none";
            btn.style.boxShadow = "none";
            btn.style.padding = "0";
            btn.style.display = "flex";
            btn.style.justifyContent = "center";
            btn.style.alignItems = "center";

            const img = document.createElement("img");
            img.src = this.getCampaignImage(campaign.id);
            img.alt = campaign.name;
            img.className = "block";
            img.style.width = "100%";
            img.style.maxWidth = "352px";
            img.style.height = "96px";
            img.style.objectFit = "contain";
            img.style.margin = "0 auto";

            if(!unlocked){
                btn.disabled = true;
                btn.style.opacity = "0.9";
                img.style.filter = "grayscale(1) brightness(0.55) contrast(0.9)";
            } else {
                img.style.filter = "none";
            }

            btn.appendChild(img);

            btn.onclick = () => {
                if(!unlocked) return;

                CampaignSystem.selectCampaign(campaign.id);
                EnemyView.render();
                UI.show("enemy-screen");
            };

            container.appendChild(btn);
        });
    }
};