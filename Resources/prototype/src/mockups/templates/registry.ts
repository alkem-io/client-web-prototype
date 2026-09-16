/**
 * templates — photographed device plates.
 *
 * A template is an image plus, per device, the four corners of its screen as
 * they appear in that image. Calibrate one at /mockups/calibrate: drag the
 * corners over the screen, copy the emitted block, paste it here. After that a
 * composition only has to say `surface: 'photo', template: '<id>'` and the
 * live screens are mapped onto the plate.
 *
 * Put the image in `public/mockup-templates/` and reference it as
 * `/mockup-templates/<file>`. Stock plates usually ship as PSDs — export the
 * flattened plate with the screens left blank (or any flat colour) and the
 * transform here replaces them.
 */
import type { Quad } from '../core/homography';

export interface TemplateSlot {
  /** Matches a DeviceSpec's `slot` (falling back to its `id`). */
  id: string;
  kind: 'laptop' | 'phone';
  /** Design size of the flat screen before it is mapped onto the quad. */
  width: number;
  height: number;
  /** Screen corners in image pixels, clockwise from the screen's top-left. */
  quad: Quad;
}

export interface MockupTemplate {
  id: string;
  label: string;
  /** Served from `public/`. */
  image: string;
  canvas: { width: number; height: number };
  slots: TemplateSlot[];
  /** Where the photograph came from, so licensing stays traceable. */
  credit?: string;
}

const templates: MockupTemplate[] = [
  // Calibrated plates go here. Example of the shape a calibration emits:
  //
  // {
  //   id: 'desk-laptop-phone',
  //   label: 'Desk — laptop with phone in hand',
  //   image: '/mockup-templates/desk-laptop-phone.jpg',
  //   canvas: { width: 1920, height: 1080 },
  //   credit: 'Unic Design, licensed',
  //   slots: [
  //     { id: 'laptop', kind: 'laptop', width: 1440, height: 900,
  //       quad: [[262, 96], [1043, 118], [1030, 640], [268, 660]] },
  //     { id: 'phone', kind: 'phone', width: 390, height: 844,
  //       quad: [[1196, 487], [1391, 470], [1420, 896], [1224, 916]] },
  //   ],
  // },
];

export const allTemplates = () => templates;
export const templateById = (id: string) => templates.find(t => t.id === id);
