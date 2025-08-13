'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Copy, Check, MessageSquare, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [name, setName] = useState('');
  const [totalSales, setTotalSales] = useState('');
  const [identifiedSales, setIdentifiedSales] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const percentage = useMemo(() => {
    const total = parseFloat(totalSales);
    const identified = parseFloat(identifiedSales);

    if (isNaN(total) || isNaN(identified) || total <= 0 || identified < 0) {
      return '0.00';
    }
    if (identified > total) {
       return '100.00';
    }

    return ((identified / total) * 100).toFixed(2);
  }, [totalSales, identifiedSales]);

  useEffect(() => {
    const total = parseFloat(totalSales);
    const identified = parseFloat(identifiedSales);
    if (!isNaN(total) && !isNaN(identified) && identified > total) {
      setError('As vendas identificadas não podem ser maiores que o total de vendas.');
    } else {
      setError('');
    }
  }, [totalSales, identifiedSales]);

  const isFormValid = useMemo(() => {
    const total = parseFloat(totalSales);
    const identified = parseFloat(identifiedSales);
    return (
      name.trim() !== '' &&
      !isNaN(total) &&
      total > 0 &&
      !isNaN(identified) &&
      identified >= 0 &&
      identified <= total
    );
  }, [name, totalSales, identifiedSales]);

  const handleGenerateMessage = () => {
    const message = `✨ Cadastros - ${name} ✨\n\n- Vendas: ${totalSales}\n- Identificadas: ${identifiedSales}\n- Aproveitamento: ${percentage}%`;
    setGeneratedMessage(message);
    setIsCopied(false);
  };

  const handleCopyMessage = () => {
    if (generatedMessage) {
      navigator.clipboard.writeText(generatedMessage).then(
        () => {
          setIsCopied(true);
          toast({
            title: "Copiado!",
            description: "A mensagem foi copiada para a área de transferência.",
          });
          setTimeout(() => setIsCopied(false), 3000);
        },
        (err) => {
          console.error('Could not copy text: ', err);
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Não foi possível copiar a mensagem.",
          });
        }
      );
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center p-4">
          <CardTitle className="text-2xl font-headline font-bold">Acompanhamento cadastros</CardTitle>
          <CardDescription className="text-sm">Acompanhamento diário de resultados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome do colaborador</Label>
              <Input
                id="name"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="total-sales">Quantidade de vendas</Label>
                <Input
                  id="total-sales"
                  type="number"
                  placeholder="Ex: 15"
                  value={totalSales}
                  onChange={(e) => setTotalSales(e.target.value)}
                  min="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="identified-sales">Vendas identificadas</Label>
                <Input
                  id="identified-sales"
                  type="number"
                  placeholder="Ex: 10"
                  value={identifiedSales}
                  onChange={(e) => setIdentifiedSales(e.target.value)}
                  min="0"
                  className={error ? 'border-destructive' : ''}
                />
              </div>
            </div>
             {error && (
              <p className="text-xs text-destructive flex items-center gap-1"><AlertTriangle className="h-4 w-4" />{error}</p>
            )}
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-sm text-left py-2">
                <Info className="mr-2 h-4 w-4 flex-shrink-0" /> Como encontrar as vendas identificadas?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground pl-2 border-l-2 ml-2">
                Ao final do expediente, abra o histórico de vendas do sistema e verifique quantos atendimentos possuem a identificação do cliente (CPF, nome ou cadastro).
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="text-center bg-card p-3 rounded-lg border">
            <p className="text-sm text-muted-foreground">Seu aproveitamento de vendas identificadas é de:</p>
            <p className="text-4xl font-bold text-primary drop-shadow-sm">{percentage}%</p>
          </div>

          <Button
            onClick={handleGenerateMessage}
            disabled={!isFormValid}
            className="w-full py-4"
            size="lg"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Gerar Mensagem
          </Button>

          {generatedMessage && (
            <div className="space-y-2 pt-3 border-t">
              <Label htmlFor="generated-message" className="font-semibold">Mensagem Gerada</Label>
              <Textarea
                id="generated-message"
                readOnly
                value={generatedMessage}
                rows={4}
                className="text-sm bg-muted"
              />
              <Button onClick={handleCopyMessage} className="w-full" variant="secondary">
                {isCopied ? <Check className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
                {isCopied ? 'Copiado!' : 'Copiar Mensagem'}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col items-center justify-center text-center text-muted-foreground text-xs p-3">
           <p>Após copiar, cole a mensagem no grupo da loja no WhatsApp.</p>
           <p>Lembre-se: este é um acompanhamento diário!</p>
        </CardFooter>
      </Card>
    </main>
  );
}
