import Marquee from 'react-marquee-slider';
import parse, { HTMLReactParserOptions } from 'html-react-parser';

interface AktualityMarqueeProps {
  aktuality: string[];
}

const AktualityMarquee: React.FC<AktualityMarqueeProps> = ({ aktuality }) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode.type === 'tag' && domNode.name === 'a') {
        const element = domNode as any;
        element.attribs.style = (element.attribs.style || '') + 'color: #8e67ea;';
      }
    }
  };

  return (
    <div className="bg-white p-2 mt-4 mb-8 border rounded-lg shadow-md">
      <Marquee
        velocity={20}
        direction="rtl"
        scatterRandomly={false}
        resetAfterTries={200}
        onInit={() => {}}
        onFinish={() => {}}
      >
        {aktuality.map((aktualita, index) => (
          <div
            key={index}
            className="mx-4 text-lg font-semibold text-black"
            style={{ whiteSpace: 'nowrap' }}
          >
            {parse(aktualita, options)}
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default AktualityMarquee;
