import { InputDialogue } from "../ScriptDialogue/types";
import { RAW_TEXT, TEXT, TRANSLATE } from "../Utils";
import { MoonPhase, WeatherType } from "@minecraft/server";

interface ViewWeatherForecastParams {
  time: number,
  moonPhase: MoonPhase
}

const WEATHER_KEYS: Record<WeatherType, string> = {
  [WeatherType.Clear]: "jig_ccomp:weather.clear",
  [WeatherType.Rain]: "jig_ccomp:weather.raining",
  [WeatherType.Thunder]: "jig_ccomp:weather.thunder",
}

const MOON_PHASE_KEYS: Record<MoonPhase, string> = {
  [MoonPhase.FullMoon]: "jig_ccomp:moon.full-moon",
  [MoonPhase.WaningGibbous]: "jig_ccomp:moon.waning-gibbous",
  [MoonPhase.FirstQuarter]: "jig_ccomp:moon.first-quarter",
  [MoonPhase.WaningCrescent]: "jig_ccomp:moon.waning-crescent",
  [MoonPhase.NewMoon]: "jig_ccomp:moon.new-moon",
  [MoonPhase.WaxingCrescent]: "jig_ccomp:moon.waxing-crescent",
  [MoonPhase.LastQuarter]: "jig_ccomp:moon.last-quarter",
  [MoonPhase.WaxingGibbous]: "jig_ccomp:moon.waxing-gibbous",
}

export const viewWeatherForecast: (options: ViewWeatherForecastParams) => InputDialogue =
  ({ time, moonPhase}) => ({
  type: "input_dialogue",
  title: TRANSLATE("jig_ccomp:view-weather-forecast.title"),
  inputs: [
    {
      type: "dropdown",
      name: "future",
      label: RAW_TEXT(
		TEXT("\n"),
        TRANSLATE("jig_ccomp:view-weather-forecast.subtitle"),
        TEXT("\n\n"),
        TRANSLATE("jig_ccomp:view-weather-forecast.moon-phase"),
        TEXT("\n"),
        getMoonPhaseLabel(time),
        TEXT("\n"),
        TRANSLATE(MOON_PHASE_KEYS[moonPhase]),
        // TEXT("\n"),
        // TRANSLATE("jig_ccomp:view-weather-forecast.current"),
        // TEXT(": "),
        // TRANSLATE(WEATHER_KEYS[weatherType]),
        TEXT("\n"),
        TEXT("\n"),
        TRANSLATE("jig_ccomp:view-weather-forecast.future")
      ),
      defaultValue: WeatherType.Clear,
      options: [
        {
          name: WeatherType.Clear,
          option: TRANSLATE(WEATHER_KEYS[WeatherType.Clear])
        },
        {
          name: WeatherType.Rain,
          option: TRANSLATE(WEATHER_KEYS[WeatherType.Rain])
        },
        {
          name: WeatherType.Thunder,
          option: TRANSLATE(WEATHER_KEYS[WeatherType.Thunder])
        }
      ]
    }
  ]
});

const getMoonPhaseLabel = (time: number) => {
  if (time < 11834) {
    return TRANSLATE("jig_ccomp:view-weather-forecast.tonight");
  } else {
    return TRANSLATE("jig_ccomp:view-weather-forecast.current");
  }
}
