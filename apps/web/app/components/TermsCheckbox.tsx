import { useState } from "react";

import { Checkbox } from "~/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";

interface TermsCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function TermsCheckbox({ checked, onCheckedChange }: TermsCheckboxProps) {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <div className="flex items-start gap-2">
        <Checkbox
          id="terms-checkbox"
          checked={checked}
          onCheckedChange={(val) => onCheckedChange(val === true)}
          className="mt-0.5"
        />
        <label htmlFor="terms-checkbox" className="text-sm leading-snug text-neutral-700">
          Acepto los{" "}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setTermsOpen(true);
            }}
            className="font-semibold underline hover:text-primary-600"
          >
            Terminos y Condiciones
          </button>{" "}
          y la{" "}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setPrivacyOpen(true);
            }}
            className="font-semibold underline hover:text-primary-600"
          >
            Politica de Privacidad
          </button>
        </label>
      </div>

      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Terminos y Condiciones</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm text-neutral-600">
            <p>
              Estos son los terminos y condiciones de uso de la plataforma. Al registrarte y
              utilizar nuestros servicios, aceptas cumplir con las siguientes condiciones.
            </p>
            <p>
              Este contenido sera actualizado proximamente con los terminos y condiciones completos.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Politica de Privacidad</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm text-neutral-600">
            <p>
              Tu privacidad es importante para nosotros. Esta politica describe como recopilamos,
              usamos y protegemos tu informacion personal.
            </p>
            <p>
              Este contenido sera actualizado proximamente con la politica de privacidad completa.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
