import { Player, system, WeatherType, world } from "@minecraft/server";
import { CraftComputer } from "./CraftComputers";
import { openInputDialogue } from "./ScriptDialogue/index";
import { viewWeatherForecast } from "./Dialogues/ViewWeatherForecast";
import { debug } from "./Utils";

export const initWeather = () => {
  system.afterEvents.scriptEventReceive.subscribe((event) => {
    const player = event.initiator;
    const sourceEntity = event.sourceEntity;
    if (player && player instanceof Player && sourceEntity && CraftComputer.isComputer(sourceEntity)) {
      if (event.id === 'jig_ccomp:show_weather') {
        system.runTimeout(async () => {
          const response = await openInputDialogue(viewWeatherForecast({
            moonPhase: world.getMoonPhase(),
            time: world.getTimeOfDay()
          }), player);
          debug(JSON.stringify(response));
          if (response.type === "input_dialogue") {
            const { future } = response.responses;
            player.dimension.setWeather(future.value as WeatherType);
          }
        }, 10);
      }
    }
  }, {
    namespaces: [
      "jig_ccomp"
    ]
  });
};
