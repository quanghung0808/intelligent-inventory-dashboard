import React, { useState } from 'react';
import { PlusCircle, Send, Loader2, CheckCircle2, AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ActionType, CreateActionPayload } from '../../types/vehicle';
import { useLogVehicleAction } from '../../hooks/useVehicles';
import { ACTION_OPTIONS, QUICK_TEMPLATES } from './actionConstants';
import { cn } from '@/lib/utils';

interface ActionFormProps {
  vehicleId: string;
  onClose: () => void;
}

/**
 * Self-contained form for logging a manager action against a vehicle.
 * Owns all local form state and orchestrates the optimistic mutation.
 */
export const ActionForm: React.FC<ActionFormProps> = ({ vehicleId, onClose }) => {
  const { mutateAsync, isPending } = useLogVehicleAction();
  const [actionType, setActionType] = useState<ActionType>('PRICE_DROP');
  const [note, setNote] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      setErrorMessage('Please enter an action note or justification.');
      return;
    }

    setErrorMessage(null);

    const payload: CreateActionPayload = {
      actionType,
      note: note.trim(),
      author: 'Marcus Vance (Inventory Manager)',
    };

    try {
      await mutateAsync({ vehicleId, payload });
      setNote('');
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to persist action';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast / Error alerts */}
      {errorMessage && (
        <Alert variant="destructive" className="bg-rose-50 border-rose-300 text-rose-900 rounded-xl">
          <AlertOctagon className="size-4 text-rose-600" />
          <AlertDescription className="text-xs text-rose-800 font-medium">
            {errorMessage} (Optimistic changes rolled back)
          </AlertDescription>
        </Alert>
      )}

      {successToast && (
        <Alert className="bg-emerald-50 border-emerald-300 text-emerald-900 rounded-xl">
          <CheckCircle2 className="size-4 text-emerald-600" />
          <AlertDescription className="text-xs text-emerald-800 font-bold">
            Action logged and synchronized across dealership database!
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
          <PlusCircle className="size-4 text-indigo-600" />
          Log Manager Action &amp; Lot Strategy
        </div>

        {/* Action Type Select Buttons */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Select Proposed Strategy *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {ACTION_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.type}
                onClick={() => setActionType(opt.type)}
                className={cn(
                  'p-3 rounded-xl text-left text-xs font-semibold border transition-all duration-150 relative overflow-hidden',
                  actionType === opt.type
                    ? 'bg-indigo-50/90 text-indigo-950 border-indigo-500 ring-2 ring-indigo-400 shadow-xs'
                    : 'bg-slate-50/70 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-600 font-mono">
                    {opt.tag}
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-xs">{opt.label}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1 mt-1 font-medium">
                  {opt.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Templates */}
        <div>
          <span className="text-[11px] text-slate-500 block mb-2 font-bold">
            Quick Template Suggestions:
          </span>
          <div className="flex flex-wrap gap-2">
            {QUICK_TEMPLATES[actionType]?.map((tmpl) => (
              <Button
                key={tmpl.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setNote(tmpl.text)}
                className="text-[11px] h-7 px-2.5 bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 hover:border-indigo-300 border-slate-200 rounded-lg font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {tmpl.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Free-text Note */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Manager Justification &amp; Operational Details *
          </label>
          <Textarea
            rows={3}
            placeholder="Document rationale, discount amount, or operational instructions..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-white border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 rounded-xl focus-visible:ring-indigo-500"
          />
        </div>

        {/* Submit button */}
        <div className="flex justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-900 rounded-xl font-bold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isPending || !note.trim()}
            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 rounded-xl px-4"
          >
            {isPending ? (
              <>
                <Loader2 data-icon="inline-start" className="size-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Send data-icon="inline-start" className="size-3.5" />
                Log Action
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
