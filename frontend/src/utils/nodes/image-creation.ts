import ImageMana

const add_image = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
	const img = new Image()
	img.src = reader.result as string
	img.onload = () => {
	    setImage(img)
	}
    }
    reader.readAsDataURL(file)
}
