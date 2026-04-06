const Visuals = {

  async shake(element) {
    return new Promise(resolve => {
      gsap.to(element, {
        x: -8,
        duration: 0.05,
        yoyo: true,
        repeat: 5,
        onComplete: resolve
      });
    });
  },

  async damageNumber(element, value) {
    return new Promise(resolve => {

      const dmg = document.createElement("div");
      dmg.classList.add("damage-number");
      dmg.innerText = `-${value}`;

      element.appendChild(dmg);

      gsap.fromTo(dmg,
        { y: 0, opacity: 1 },
        {
          y: -40,
          opacity: 0,
          duration: 0.8,
          onComplete: () => {
            dmg.remove();
            resolve();
          }
        }
      );
    });
  },

  async glow(element, color = "orange") {
    return new Promise(resolve => {
      gsap.fromTo(element,
        { boxShadow: `0 0 0px ${color}` },
        {
          boxShadow: `0 0 20px ${color}`,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          onComplete: resolve
        }
      );
    });
  }

};