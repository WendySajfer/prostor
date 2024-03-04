import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { cn } from '~/lib/utils'

export function InputTitle({
  setTitle,
}: {
  setTitle: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <Input
      className={cn(`form-border-gradient !border-2`, `font-medium`)}
      type="text"
      placeholder="Название"
      onChange={(event) => setTitle(event.target.value)}
    />
  )
}

export function InputBody({
  setBody,
}: {
  setBody: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <Textarea
      className={cn(
        `max-h-[390px]`,
        `form-border-gradient !border-2`,
        `font-medium`,
      )}
      placeholder="Несите тело"
      onChange={(event) => setBody(event.target.value)}
    />
  )
}

export function ButtonSubmit() {
  return (
    <div className={cn(`mt-2 flex w-full justify-end`)}>
      <Button type="submit" className={cn(`custom-button_animate w-[50%]`)}>
        Опубликовать
      </Button>
    </div>
  )
}
