export const getVKSrc = (src: string) => {
  const regex = /video(-?\d+)_(\d+)/;
  const match = src.match(regex);

  if (match) {
    const oid = match[1];
    const id = match[2];

    return `https://vk.ru/video_ext.php?oid=${oid}&id=${id}`;
  }

  return null;
};

export const getYTSrc = (src: string) => {
  const re = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

  const video = src.match(re)?.[2];

  return video ? `https://www.youtube.com/embed/${video}` : null;
};

export const getRTSrc = (src: string) => {
  const regex = /video\/([a-zA-Z0-9]+)/;
  const match = src.match(regex);

  const id = match?.[1];

  return `https://rutube.ru/play/embed/${id}`;
};
